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

import { render, VNode } from "preact";
import { html } from "htm/preact";

import { findBciAvId, findCompositionsUsingId } from "./BciAvUtils";
import { GlossSearchPalette } from "./GlossSearchPalette";

const GLOSS_ENTRY_FIELD_ID = "glossSearchField";
const SUBMIT_LABEL = "Search";

export function ActionSearchGloss (): VNode {

  const searchGloss = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchText = formData.get(GLOSS_ENTRY_FIELD_ID).trim();
    let noSearchTerm;
    let matches;
    if (searchText.length === 0) {
      noSearchTerm = true;
      matches = [];
    }
    else {
      noSearchTerm = false;
      const numberId = Number(searchText);
      if (isNaN(numberId)) {
        matches = findBciAvId(searchText);
      }
      else {
        matches = findCompositionsUsingId(numberId);
      }
    }
    console.debug(`Search term? ${noSearchTerm}, found ${matches.length} matches`);
    render(
      html`<${GlossSearchPalette} matches=${matches} noSearchTerm=${noSearchTerm} searchTerm=${searchText} />`,
      document.getElementById("searchGlossResults")
    );
  };

  return html`
    <form onSubmit=${searchGloss} class="actionSearchGloss">
      <label for=${GLOSS_ENTRY_FIELD_ID} style="color: white;">Search gloss: </label>
      <input id=${GLOSS_ENTRY_FIELD_ID} name=${GLOSS_ENTRY_FIELD_ID} type="text"/>
      <input type="submit" value=${SUBMIT_LABEL} />
    </form>
  `;
}
