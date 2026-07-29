import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  BaseWsExceptionFilter,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseFilters } from '@nestjs/common';

import { DepartmentMessagesCommandService } from 'src/departmentMessages/application/departmentMessages-command.service';
import { DepartmentMessagesQueryService } from 'src/departmentMessages/application/departmentMessages-query.service';
import { DepartmentMessageResponseMapper } from '../mappers/departmentMessage-response.mapper';

import { DepartmentMemberQueryRepository } from 'src/demos/application/ports/department-member/department-member-query.repository';
import { JoinDepartmentDto } from '../dto/join-chat.dto';
import { SendMessageDto } from '../dto/send-departmentMessage.dto';
import { EditMessageDto } from '../dto/edit-departmentMessage.dto';
import { DeleteMessageDto } from '../dto/delete-departmentMessage.dto';
import { TokenService } from 'src/iam/application/services/token.service';
import { AuthenticatedSocket } from './interfaces/authenticated-socket.interface';

@WebSocketGateway({
  namespace: 'departmentChat',
  cors: { origin: '*' },
})
@UseFilters(BaseWsExceptionFilter)
export class DepartmentMessagesGateway {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly departmentMessageCommandService: DepartmentMessagesCommandService,
    private readonly departmentMessageQueryService: DepartmentMessagesQueryService,
    private readonly responseMapper: DepartmentMessageResponseMapper,
    private readonly tokenService: TokenService,
    private readonly departmentMemberQueryRepository: DepartmentMemberQueryRepository,
  ) {}

  afterInit(server: Server) {
    server.use((socket: Socket, next) => {
      (async () => {
        const client = socket as AuthenticatedSocket;
        const token = client.handshake.headers?.token as string;
        if (!token) {
          return next(new Error('UNAUTHORIZED: Token missing'));
        }
        const payload = await this.tokenService.verifyAccessToken(token);
        client.data.user = payload;
        next();
      })().catch((_error) => {
        next(new Error('UNAUTHORIZED: Invalid token'));
      });
    });
  }

  @SubscribeMessage('joinChat')
  async handleJoinRoom(
    @MessageBody() { departmentId }: JoinDepartmentDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const userId = client.data.user.id;

    const member = await this.departmentMemberQueryRepository.findByUserId(
      departmentId,
      userId,
    );

    if (!member) {
      throw new WsException('errors.USER_IS_NOT_A_MEMBER_OF_THIS_DEPARTMENT');
    }

    client.data.departmentId = departmentId;
    client.data.role = member.role;
    client.data.departmentMemberId = member.id;

    const roomName = `dept_${departmentId}`;
    await client.join(roomName);

    return { status: 'joined', room: roomName };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() dto: SendMessageDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { departmentId, departmentMemberId } =
      this.validateClientContext(client);

    const domainMessage = await this.departmentMessageCommandService.create(
      departmentMemberId,
      departmentId,
      dto,
    );

    await this.broadcastMessage(
      departmentId,
      'messageReceived',
      domainMessage.id,
    );
    return { status: 'success', messageId: domainMessage.id };
  }

  @SubscribeMessage('editMessage')
  async handleEditMessage(
    @MessageBody() dto: EditMessageDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { departmentId } = this.validateClientContext(client);

    const domainMessage = await this.departmentMessageCommandService.update(
      dto.messageId,
      {
        content: dto.content,
      },
    );

    await this.broadcastMessage(
      departmentId,
      'messageEdited',
      domainMessage.id,
    );
    return { status: 'success', messageId: domainMessage.id };
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    @MessageBody() { messageId }: DeleteMessageDto,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    const { departmentId } = this.validateClientContext(client);

    const domainMessage =
      await this.departmentMessageCommandService.remove(messageId);

    await this.broadcastMessage(
      departmentId,
      'messageDeleted',
      domainMessage.id,
    );
    return { status: 'success', messageId: domainMessage.id };
  }

  private validateClientContext(client: AuthenticatedSocket) {
    const { departmentId, user, departmentMemberId } = client.data;
    if (!departmentId || !departmentMemberId || !user) {
      throw new WsException('errors.UNAUTHORIZED_OR_NOT_JOINED_YET');
    }
    return { departmentId, departmentMemberId };
  }

  private async broadcastMessage(
    departmentId: string,
    event: string,
    messageId: string,
  ) {
    const fullMessage =
      await this.departmentMessageQueryService.findById(messageId);
    const response = this.responseMapper.toResponseFromPrisma(fullMessage);
    this.server.to(`dept_${departmentId}`).emit(event, response);
  }
}
