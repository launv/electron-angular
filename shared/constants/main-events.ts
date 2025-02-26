export const ELECTRON_LIFE_CYCLE = {
  READY: 'ready',
  WHENREADY: 'whenReady',
  WINDOW_ALL_CLOSED: 'window-all-closed',
  ACTIVATE: 'activate',
  BEFORE_QUIT: 'before-quit',
  WILL_QUIT: 'will-quit',
  QUIT: 'quit',
  GPU_PROCESS_CRASHED: 'gpu-process-crashed',
};

export const WINDOW_EVENT = {
  CLOSED: 'closed',
};

export const IPC_EVENT = {
  WRITE_FILE: 'write-file',
  WRITE_FILE_RESPONSE: 'write-file-response',
  READ_FILE: 'read-file',
  READ_FILE_RESPONSE: 'read-file-response',
};
