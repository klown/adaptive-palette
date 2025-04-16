/*
 * Copyright 2025 Inclusive Design Research Centre, OCAD University
 * All rights reserved.
 *
 * Licensed under the New BSD license. You may not use this file except in
 * compliance with this License.
 *
 * You may obtain a copy of the License at
 * https://github.com/inclusive-design/adaptive-palette/blob/main/LICENSE
 */

import "@testing-library/jest-dom";

import { getModelNames } from "./ollamaApi";

describe("ollamaApi unit tests", (): void => {

  test("Get models", async (): Promise<void> => {
    const modelNames = await getModelNames();
    expect(modelNames).not.toBeNull();
  });
});

