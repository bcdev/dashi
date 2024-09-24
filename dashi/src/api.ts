import { PanelEventData, PanelModel, Panels } from "./lib/model.ts";

export interface FetchResponse<T> {
  result?: T;
  error?: string;
}

export async function fetchPanels(): Promise<FetchResponse<Panels>> {
  return fetchJson("http://localhost:8888/panels");
}

export async function fetchPanel(
  panelId: string,
  event?: PanelEventData,
): Promise<FetchResponse<PanelModel>> {
  const url = `http://localhost:8888/panels/${panelId}`;
  if (event) {
    return fetchJson(url, {
      method: "post",
      body: JSON.stringify(event),
    });
  } else {
    return fetchJson(url);
  }
}

export async function fetchJson<T>(
  url: string,
  init?: RequestInit,
): Promise<FetchResponse<T>> {
  try {
    const response = await fetch(url, init);
    if (response.ok) {
      const result = await response.json();
      return { result: result as T };
    } else {
      return { error: response.statusText };
    }
  } catch (e) {
    return { error: `${e}` };
  }
}
