export interface SendListDto {
  title: string;

  rows: Array<{
    title: string;
    id: string;
  }>;
}
