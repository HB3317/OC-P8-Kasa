import { beforeEach, describe, expect, it } from "vitest";
import { getGuestFavorites, saveGuestFavorites } from "@/services/favoriteService";

const key = "kasa_guest_favorites";

beforeEach(() => {
  localStorage.clear();
});

describe("favoris invités (localStorage)", () => {
  it("lit les identifiants précédemment enregistrés", () => {
    localStorage.setItem(key, JSON.stringify(["a", "b"]));
    expect(getGuestFavorites()).toEqual(["a", "b"]);
  });

  it("supprime les doublons et ignore les valeurs non textuelles", () => {
    localStorage.setItem(key, JSON.stringify(["a", "a", 12, null, "b"]));
    expect(getGuestFavorites()).toEqual(["a", "b"]);
  });

  it("retourne une liste vide si le JSON est invalide", () => {
    localStorage.setItem(key, "{json invalide");
    expect(getGuestFavorites()).toEqual([]);
  });

  it("enregistre une liste sans doublons", () => {
    saveGuestFavorites(["a", "a", "b"]);
    expect(JSON.parse(localStorage.getItem(key) ?? "null")).toEqual(["a", "b"]);
  });
});
