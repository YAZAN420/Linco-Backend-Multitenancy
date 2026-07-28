import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  BaseWsExceptionFilter,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';

import { DepartmentMessagesCommandService } from 'src/departmentMessages/application/departmentMessages-command.service';
import { DepartmentMessagesQueryService } from 'src/departmentMessages/application/departmentMessages-query.service';
import { DepartmentMessageResponseMapper } from '../mappers/departmentMessage-response.mapper';
import { CreateDepartmentMessageDto } from '../dto/create-departmentMessage.dto';
import { UpdateDepartmentMessageDto } from '../dto/update-departmentMessage.dto';

@WebSocketGateway({
  namespace: 'departmentChat',
  cors: { origin: '*' },
})
@UseFilters(BaseWsExceptionFilter)
@UsePipes(new ValidationPipe({ transform: true }))
export class DepartmentMessagesGateway {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly commandService: DepartmentMessagesCommandService,
    private readonly queryService: DepartmentMessagesQueryService,
    private readonly responseMapper: DepartmentMessageResponseMapper,
  ) {}

  @SubscribeMessage('joinChat')
  async handleJoinRoom(
    @MessageBody('departmentId') departmentId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const roomName = `dept_${departmentId}`;
    await client.join(roomName);
    return { status: 'joined', room: roomName };
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() dto: CreateDepartmentMessageDto,
    @ConnectedSocket() _client: Socket,
  ) {
    const domainMessage = await this.commandService.create(dto);
    const fullMessage = await this.queryService.findById(domainMessage.id);
    const response = this.responseMapper.toResponseFromPrisma(fullMessage);
    const roomName = `dept_${dto.departmentId}`;
    this.server.to(roomName).emit('messageReceived', response);
    return { status: 'success', messageId: domainMessage.id };
  }
  @SubscribeMessage('editMessage')
  async handleEditMessage(
    @MessageBody()
    dto: UpdateDepartmentMessageDto & {
      messageId: string;
      departmentId: string;
    },
  ) {
    const domainMessage = await this.commandService.update(dto.messageId, dto);
    const fullMessage = await this.queryService.findById(domainMessage.id);
    const response = this.responseMapper.toResponseFromPrisma(fullMessage);
    const roomName = `dept_${dto.departmentId}`;
    this.server.to(roomName).emit('messageEdited', response);
  }

  @SubscribeMessage('deleteMessage')
  async handleDeleteMessage(
    @MessageBody() dto: { messageId: string; departmentId: string },
  ) {
    const domainMessage = await this.commandService.remove(dto.messageId);
    const fullMessage = await this.queryService.findById(domainMessage.id);
    const response = this.responseMapper.toResponseFromPrisma(fullMessage);
    const roomName = `dept_${dto.departmentId}`;
    this.server.to(roomName).emit('messageDeleted', response);
  }
}
