/**
 * 全局注册表：统一导出所有已激活的量表
 *
 * 新增量表时，只需在此数组的 import 后 push 即可
 */

import type { ScaleDefinition } from "./types";
import { ABC_Scale } from "../autism/abc";
import { CARS_Scale } from "../autism/cars"; // 1. 引入你新建的 CARS 量表

/** 所有已激活的量表 */
export const AllScales: ScaleDefinition[] = [
  ABC_Scale,
  CARS_Scale // 2. 把 CARS 量表加到数组里
];