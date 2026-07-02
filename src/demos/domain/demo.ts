import { DomainException } from 'src/common/exceptions/domain.exception';
import { Department } from './department';
import { DemoProps } from './interfaces/demo.props';
import { Name } from './value-objects/name.vo';
import { PlanTier } from '../../common/enums/plan-tier.enum';
import { SubscriptionStatus } from './enums/subscription-status.enum';

export class Demo {
  constructor(
    public readonly id: string,
    private readonly props: DemoProps,
  ) {}

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get plan(): PlanTier {
    return this.props.plan;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get imagePath(): string {
    return this.props.imagePath;
  }

  get description(): string {
    return this.props.description;
  }

  get name(): string {
    return this.props.name.value;
  }

  get ownerId(): string {
    return this.props.ownerId;
  }

  get departments(): Department[] {
    return this.props.departments ?? [];
  }

  get stripeSubscriptionId(): string | undefined {
    return this.props.stripeSubscriptionId;
  }
  get subscriptionStatus(): SubscriptionStatus {
    return this.props.subscriptionStatus;
  }

  get currentPeriodEnd(): Date {
    return this.props.currentPeriodEnd;
  }

  get maxMembersLimit(): number {
    switch (this.props.plan) {
      case PlanTier.ENTERPRISE:
        return 100;
      case PlanTier.PRO:
        return 25;
      case PlanTier.STARTER:
      default:
        return 5;
    }
  }

  get maxDepartmentsLimit(): number {
    switch (this.props.plan) {
      case PlanTier.ENTERPRISE:
        return 50;
      case PlanTier.PRO:
        return 10;
      case PlanTier.STARTER:
      default:
        return 2;
    }
  }

  isTrialValid(): boolean {
    if (this.props.subscriptionStatus !== SubscriptionStatus.TRIALING) {
      return false;
    }
    return (
      this.props.currentPeriodEnd && new Date() <= this.props.currentPeriodEnd
    );
  }

  isAccessAllowed(): boolean {
    return this.isSubscriptionActive() || this.isTrialValid();
  }

  private isSubscriptionActive(): boolean {
    if (this.props.subscriptionStatus !== SubscriptionStatus.ACTIVE) {
      return false;
    }

    if (
      this.props.currentPeriodEnd &&
      new Date() > this.props.currentPeriodEnd
    ) {
      return false;
    }

    return true;
  }
  isStarterFeatureAllowed(): boolean {
    if (this.props.plan === PlanTier.STARTER) {
      return false;
    }

    return this.isSubscriptionActive();
  }

  isProFeatureAllowed(): boolean {
    if (this.props.plan === PlanTier.PRO) {
      return false;
    }

    return this.isSubscriptionActive();
  }
  isEnterpriseFeatureAllowed(): boolean {
    if (this.props.plan !== PlanTier.ENTERPRISE) {
      return false;
    }

    return this.isSubscriptionActive();
  }

  activateSubscription(stripeSubId: string, periodEnd: Date): void {
    this.props.subscriptionStatus = SubscriptionStatus.ACTIVE;
    this.props.stripeSubscriptionId = stripeSubId;
    this.props.currentPeriodEnd = periodEnd;
    this.touch();
  }

  updatePlan(newPlan: PlanTier): void {
    if (this.props.plan === newPlan) return;
    this.props.plan = newPlan;
    this.touch();
  }

  updateName(newName: Name): void {
    if (!this.isAccessAllowed()) {
      throw new DomainException(
        'Your subscription has expired. Please upgrade to continue.',
      );
    }
    if (this.props.name.equals(newName)) return;
    this.props.name = newName;
    this.touch();
  }

  updateImagePath(newImagePath: string): void {
    if (!this.isAccessAllowed()) {
      throw new DomainException(
        'Your subscription has expired. Please upgrade to continue.',
      );
    }
    if (this.props.imagePath === newImagePath) return;
    this.props.imagePath = newImagePath;
    this.touch();
  }

  updateDescription(newDescription: string): void {
    if (!this.isAccessAllowed()) {
      throw new DomainException(
        'Your subscription has expired. Please upgrade to continue.',
      );
    }
    if (this.props.description === newDescription) return;
    this.props.description = newDescription;
    this.touch();
  }

  addDepartment(department: Department): void {
    if (!this.isAccessAllowed()) {
      throw new DomainException(
        'Your subscription has expired. Please upgrade to continue.',
      );
    }
    if (!department) {
      throw new DomainException('Department cannot be null or undefined');
    }

    if (this.departments.length >= this.maxDepartmentsLimit) {
      throw new DomainException(
        `Your current plan (${this.props.plan}) allows a maximum of ${this.maxDepartmentsLimit} departments. Please upgrade.`,
      );
    }

    const exists = this.departments.some(
      (d) => d.name.toLowerCase() === department.name.toLowerCase(),
    );
    if (exists) {
      throw new DomainException(
        `Department "${department.name}" already exists`,
      );
    }

    this.props.departments.push(department);
    this.touch();
  }

  removeDepartment(departmentId: string): void {
    if (!this.isAccessAllowed()) {
      throw new DomainException(
        'Your subscription has expired. Please upgrade to continue.',
      );
    }
    if (!this.hasDepartment(departmentId)) {
      throw new DomainException('Department not found in this demo');
    }

    const index = this.props.departments.findIndex(
      (d) => d.id === departmentId,
    );
    if (index !== -1) {
      this.props.departments.splice(index, 1);
      this.touch();
    }
  }

  renameDepartment(departmentId: string, newName: Name): void {
    if (!this.isAccessAllowed()) {
      throw new DomainException(
        'Your subscription has expired. Please upgrade to continue.',
      );
    }
    const department = this.getDepartmentStrict(departmentId);

    if (department.nameVo.equals(newName)) return;

    const nameExists = this.departments.some(
      (d) => d.id !== departmentId && d.nameVo.equals(newName),
    );

    if (nameExists) {
      throw new DomainException(
        `Department "${newName.value}" already exists in this demo`,
      );
    }

    department.updateName(newName);
    this.touch();
  }

  updateDepartmentDescription(
    departmentId: string,
    newDescription: string,
  ): void {
    if (!this.isAccessAllowed()) {
      throw new DomainException(
        'Your subscription has expired. Please upgrade to continue.',
      );
    }
    const department = this.getDepartmentStrict(departmentId);
    department.updateDescription(newDescription);
    this.touch();
  }

  reassignDepartmentManager(departmentId: string, newManagerId: string): void {
    if (!this.isAccessAllowed()) {
      throw new DomainException(
        'Your subscription has expired. Please upgrade to continue.',
      );
    }
    const department = this.getDepartmentStrict(departmentId);
    department.updateManager(newManagerId);
    this.touch();
  }

  hasDepartment(departmentId: string): boolean {
    return this.departments.some((d) => d.id === departmentId);
  }

  verifyCanAddMember(currentCount: number): void {
    if (!this.isAccessAllowed()) {
      throw new DomainException(
        'Your subscription has expired. Please upgrade to continue.',
      );
    }
    if (currentCount >= this.maxMembersLimit) {
      throw new DomainException(
        `Your current plan (${this.props.plan}) limits you to ${this.maxMembersLimit} members. Please upgrade.`,
      );
    }
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  private getDepartmentStrict(departmentId: string): Department {
    if (!this.isAccessAllowed()) {
      throw new DomainException(
        'Your subscription has expired. Please upgrade to continue.',
      );
    }
    const department = this.departments.find((d) => d.id === departmentId);
    if (!department) {
      throw new DomainException('Department not found in this demo');
    }
    return department;
  }
}
