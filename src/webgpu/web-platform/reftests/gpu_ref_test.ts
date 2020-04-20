import { DevicePool } from '../../../common/framework/gpu/implementation.js';
import { assert, unreachable } from '../../../common/framework/util/util.js';

const devicePool = new DevicePool();

export class GPURefTest {
  private objects: { device: GPUDevice; queue: GPUQueue } | undefined = undefined;
  initialized = false;

  get device(): GPUDevice {
    assert(this.objects !== undefined);
    return this.objects.device;
  }

  get queue(): GPUQueue {
    assert(this.objects !== undefined);
    return this.objects.queue;
  }

  async init(): Promise<void> {

    const device = await devicePool.acquire();
    const queue = device.defaultQueue;
    this.objects = { device, queue };

    try {
      await device.popErrorScope();
      unreachable('There was an error scope on the stack at the beginning of the test');
    } catch (ex) { }

    device.pushErrorScope('out-of-memory');
    device.pushErrorScope('validation');

    this.initialized = true;
  }

  async finalize(): Promise<void> {
    if (this.initialized) {
      try {
        await this.device.popErrorScope()
      } catch (ex) { }
    }

    // Note: finalize is called even if init was unsuccessful.
    if (this.objects) {
      devicePool.release(this.objects.device);
    }
  }
}
