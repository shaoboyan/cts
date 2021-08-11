import { assert, unreachable } from '../../../common/util/util.js';
import { kTextureFormatInfo } from '../../capability_info.js';

// StorageTexture: access must be write is specified
//   - var storeTex: texture_storage_1d<texel_format,access>
//   - var storeTex: texture_storage_2d<texel_format,access>
//   - var storeTex: texture_storage_2d_array<texel_format,access>
//   - var storeTex: texture_storage_3d<texel_format,access>
export function generateStorageTextureBindingDeclare(
  binding: GPUStorageTextureBindingLayout
): string {
  assert(kTextureFormatInfo[binding.format].storage);

  let textureType: string;
  switch (binding.viewDimension ?? '2d') {
    case '1d': {
      textureType = 'texture_storage_1d';
      break;
    }
    case '2d': {
      textureType = 'texture_storage_2d';
      break;
    }
    case '2d-array': {
      textureType = 'texture_storage_2d_array';
      break;
    }
    case '3d': {
      textureType = 'texture_storage_3d';
      break;
    }
    default:
      // Cannot be 'cube' or 'cube-array'
      unreachable();
  }

  let access: string;
  switch (binding.access) {
    case 'read-only': {
      access = 'read';
      break;
    }
    case 'write-only': {
      access = 'write';
      break;
    }
    default:
      unreachable();
  }

  const declare = `var storeTex: ${textureType}<${binding.format}, ${access}>`;
  return declare;
}
