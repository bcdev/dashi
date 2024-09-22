import { EventData, PanelModel } from "./lib/types.ts";

export interface FetchResponse<T> {
  result?: T;
  error?: string;
}

const API_URL = `http://localhost:8888/panel`;

export async function fetchPanelInit(): Promise<FetchResponse<PanelModel>> {
  return fetchJson(API_URL);
}

export async function fetchPanelUpdate(
  event: EventData,
): Promise<FetchResponse<PanelModel>> {
  return fetchJson(API_URL, {
    method: "post",
    headers: {},
    body: JSON.stringify(event),
  });
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
