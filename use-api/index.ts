import { isNil } from "lodash";
import useSWR from "swr";

function buildQuery(query: string) {
  const params = new URLSearchParams();

  Object.keys(query).forEach((key) => {
    if (!isNil(query[key])) {
      params.append(key, query[key]);
    }
  });

  return params.toString();
}

function post(path: string, data: any) {
  return fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
}

function get(path: string, query: any = {}) {
  return useSWR(`${path}?${buildQuery(query)}`);
}

export const useArts = (query) => get("/api/art/search", query);

export const useArt = (id: string) => get(`/api/art/${id}`);

export const addArt = (data: any) => post("/api/art", data);

export const updateArt = (id: string, data: any) =>
  post(`/api/art/${id}`, data);

export const useArtists = (query) => get("/api/artist/search", query);

export const useArtist = (id: string) => get(`/api/artist/${id}`);

export const updateArtist = (id: string, data: any) =>
  post(`/api/artist/${id}`, data);

export const useMuseums = (query) => get("/api/museum/search", query);

export const useMuseum = (id: string) => get(`/api/museum/${id}`);

export const updateMuseum = (id: string, data: any) =>
  post(`/api/museum/${id}`, data);

export const createMuseum = (data: any) => post(`/api/museum/create`, data);

export const useMovements = (query) => get("/api/movement/search", query);

export const useMovement = (id: string) => get(`/api/movement/${id}`);

export const updateMovement = (id: string, data: any) =>
  post(`/api/movement/${id}`, data);

export const createMovement = (data: any) => post(`/api/movement/create`, data);
