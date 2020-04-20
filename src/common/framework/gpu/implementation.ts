/// <reference types="@webgpu/types" />

import { assert } from '../util/util.js';

let impl: GPU | undefined = undefined;

export function getGPU(): GPU {
  if (impl) {
    return impl;
  }

  assert(
    typeof navigator !== 'undefined' && navigator.gpu !== undefined,
    'No WebGPU implementation found'
  );

  impl = navigator.gpu;
  return impl;
}

export class DevicePool {
  device: GPUDevice | undefined = undefined;
  state: 'free' | 'acquired' | 'uninitialized' | 'failed' = 'uninitialized';

  private async initialize(): Promise<void> {
    try {
      const gpu = getGPU();
      const adapter = await gpu.requestAdapter();
      this.device = await adapter.requestDevice();
    } catch (ex) {
      this.state = 'failed';
      throw ex;
    }
  }

  async acquire(): Promise<GPUDevice> {
    assert(this.state !== 'acquired', 'Device was in use');
    assert(this.state !== 'failed', 'Failed to initialize WebGPU device');

    const state = this.state;
    this.state = 'acquired';
    if (state === 'uninitialized') {
      await this.initialize();
    }

    assert(!!this.device);
    return this.device;
  }

  release(device: GPUDevice): void {
    assert(this.state === 'acquired');
    assert(device === this.device, 'Released device was the wrong device');
    this.state = 'free';
  }
}
