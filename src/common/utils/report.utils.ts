export class ReportUtils {
  static rounded(value: number): number {
    return Math.round(value * 100) / 100;
  }

  static average(values: number[]): number {
    if (!values || values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + val, 0);
    return this.rounded(sum / values.length);
  }

  static rate(part: number, total: number): number {
    if (!total) return 0;
    return this.rounded((part / total) * 100);
  }
}
