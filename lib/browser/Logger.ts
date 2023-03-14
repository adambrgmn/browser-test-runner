interface Message<Context = unknown> {
  level: 'info' | 'error' | 'test-result' | 'suite-result' | 'total-result';
  text: string;
  context?: Context;
}

interface Writer {
  init?(): Promise<void>;
  close?(): Promise<void>;
  write(message: Message): void;
}

export class Logger {
  #writers: Set<Writer>;

  constructor(writers: Writer[]) {
    this.#writers = new Set(writers);
  }

  async init() {
    for (let writer of this.#writers) {
      if (writer.init != null) await writer.init();
    }
  }

  async close() {
    for (let writer of this.#writers) {
      if (writer.close != null) await writer.close();
    }
  }

  write(message: Message) {
    for (let writer of this.#writers) {
      writer.write(message);
    }
  }
}

export class ServerWriter implements Writer {
  write(message: Message) {
    fetch('/log', {
      method: 'POST',
      body: JSON.stringify(message),
    }).catch(() => {
      // void
    });
  }
}
