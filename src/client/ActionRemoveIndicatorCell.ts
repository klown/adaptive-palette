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

import { VNode } from "preact";
import { html } from "htm/preact";
import { BlissSymbolInfoType, LayoutInfoType, ContentSignalDataType } from "./index.d";
import { BlissSymbol } from "./BlissSymbol";
import { changeEncodingContents } from "./GlobalData";
import { generateGridStyle, speak } from "./GlobalUtils";
import { findIndicators } from "./SvgUtils";
import "./ActionIndicatorCell.scss";

type ActionIndicatorCodeCellPropsType = {
  id: string,
  options: BlissSymbolInfoType & LayoutInfoType
};

/*
 * Given an array of symbols, using the symbol at the caret, find the position
 * of the caret symbol's indicator, if any.
 * @param {ContentSignalDataType} symbols: Array of symbols and caret position.
 * @return {number} - The index of the indicator in the caret symbol's
 *                    BciAvType, or -1 if it has no indicator.
 */
function caretSymbolIndicatorPosition (symbols: ContentSignalDataType): number {
  let indicatorPositions = [];
  const { payloads, caretPosition } = symbols;
  if (payloads.length !== 0) {
    const caretSymbolBciAvId = payloads[caretPosition].bciAvId;
    indicatorPositions = findIndicators(caretSymbolBciAvId);
  }
  return ( indicatorPositions.length === 0 ? -1 : indicatorPositions[0]);
}

export function ActionRemoveIndicatorCell (props: ActionIndicatorCodeCellPropsType): VNode {
  const {
    columnStart, columnSpan, rowStart, rowSpan, label
  } = props.options;
  const removeIndicatorBciAvId = props.options.bciAvId;

  const gridStyles = generateGridStyle(columnStart, columnSpan, rowStart, rowSpan);

  // Enable the remove-indicator button only if there is an indicator on the
  // last symbol in the encoding contents array.
  const indicatorPosition = caretSymbolIndicatorPosition(changeEncodingContents.value);
  const disabled = indicatorPosition === -1;

  const cellClicked = () => {
    // Get the symbol at the caret position in the editing area and find the
    // locations within it to replace any existing indicator.
    const { caretPosition, payloads } = changeEncodingContents.value;
    const indicatorIndex = caretSymbolIndicatorPosition(changeEncodingContents.value);
    const symbolToEdit = payloads[caretPosition];
    let newBciAvId = symbolToEdit.bciAvId;
    newBciAvId = [
      ...newBciAvId.slice(0, indicatorIndex-1),
      ...newBciAvId.slice(indicatorIndex+1)
    ];
    payloads[caretPosition] = {
      "id": symbolToEdit.id + props.id,
      "label": symbolToEdit.label,
      "bciAvId": newBciAvId,
      "modifierInfo": symbolToEdit.modifierInfo
    };
    changeEncodingContents.value = {
      payloads: payloads,
      caretPosition: caretPosition
    };
    speak(`${symbolToEdit.label}`);
  };

  return html`
    <button id="${props.id}" class="actionIndicatorCell" style="${gridStyles}" onClick=${cellClicked} disabled="${disabled}">
      <${BlissSymbol}
        bciAvId=${removeIndicatorBciAvId}
        label=${label}
        isPresentation=true
      />
    </button>
  `;
}
