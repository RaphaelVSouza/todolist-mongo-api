interface IAttachment {
  filename: string,
  path: string,
  cid: string,
}

interface IMail {
  to: string;
  from: string;
  subject: string;
  template: string;
  context?: unknown;
  attachments?: Array<IAttachment>
}

export { IMail };
