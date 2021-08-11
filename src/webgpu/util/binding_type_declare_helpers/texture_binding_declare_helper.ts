import { assert, unreachable } from '../../../common/util/util.js';

// Texture
//   - var tex: texture_1d<type>
//   - var tex: texture_2d<type>
//   - var tex: texture_2d_array<type>
//   - var tex: texture_3d<type>
//   - var tex: texture_cube<type>
//   - var tex: texture_cube_array<type>
//   - var tex: texture_multisampled_2d<type>
//   - var tex: texture_depth_2d;
//   - var tex: texture_depth_2d_array;
//   - var tex: texture_depth_multisampled_2d;
//   - var tex: texture_depth_cube_array;
//   - var tex: texture_depth_cube;
export function generateTextureBindingDeclare(binding: GPUTextureBindingLayout): string {
  const isMultisampled = binding.multisampled ?? false;
  const multisampleDecoration: string = isMultisampled ? 'multisampled_' : '';

  let depthDecoration: string = '';
  let samplerFormat: string;
  switch (binding.sampleType ?? 'float') {
    case 'float': {
      assert(!isMultisampled);
      samplerFormat = '<f32>';
      break;
    }
    case 'unfilterable-float': {
      samplerFormat = '<f32>';
      break;
    }
    case 'sint': {
      samplerFormat = '<i32>';
      break;
    }
    case 'uint': {
      samplerFormat = '<u32>';
      break;
    }
    case 'depth': {
      depthDecoration = 'depth_';
      samplerFormat = '';
      break;
    }
    default:
      unreachable();
  }

  let textureType: string;
  switch (binding.viewDimension ?? '2d') {
    case '1d': {
      assert(!isMultisampled && depthDecoration === '');
      textureType = 'texture_1d';
      break;
    }
    case '2d': {
      textureType = `texture_${depthDecoration}${multisampleDecoration}2d`;
      break;
    }
    case '2d-array': {
      assert(!isMultisampled);
      textureType = `texture_${depthDecoration}2d_array`;
      break;
    }
    case 'cube': {
      assert(!isMultisampled);
      textureType = `texture_${depthDecoration}cube`;
      break;
    }
    case 'cube-array': {
      assert(!isMultisampled);
      textureType = `texture_${depthDecoration}cube_array`;
      break;
    }
    case '3d': {
      assert(!isMultisampled && depthDecoration === '');
      textureType = 'texture_3d';
      break;
    }
  }

  const suffix = textureType + samplerFormat;
  const declare = `var tex : ${suffix}`;

  return declare;
}
