import { GPURefTest } from './gpu_ref_test.js';

async function PresentToCanvasTest(): Promise<void> {
  const t = new GPURefTest();
  await t.init();
  if (typeof document === 'undefined') {
    // Skip if there is no document (Workers, Node)
    console.log('DOM is not available to create canvas element');
    return;
  }

  const canvas: any = document.getElementById('gpucanvas');
  if (canvas === null) {
    console.log('DOM is null');
    return;
  }

  // TODO: fix types so these aren't necessary
  // tslint:disable-next-line: no-any
  const ctx: any = canvas.getContext('gpupresent');
  const swapChain = ctx.configureSwapChain({
    device: t.device,
    format: 'rgba8unorm',
  });

  const colorAttachment = swapChain.getCurrentTexture();
  const colorAttachmentView = colorAttachment.createView();

  const encoder = t.device.createCommandEncoder();
  const pass = encoder.beginRenderPass({
    colorAttachments: [
      {
        attachment: colorAttachmentView,
        loadValue: { r: 0.0, g: 1.0, b: 0.0, a: 1.0 },
        storeOp: 'store',
      },
    ],
  });
  pass.endPass();
  t.device.defaultQueue.submit([encoder.finish()]);
  await t.finalize();
}
PresentToCanvasTest().then(() => {
  takeScreenshotDelayed(50);
})
