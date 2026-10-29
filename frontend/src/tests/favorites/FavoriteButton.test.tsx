import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FavoriteButton from "@/components/atoms/FavoriteButton/FavoriteButton";

const state = vi.hoisted(() => ({
  ids: [] as string[],
  isReady: true,
  toggle: vi.fn(async (id: string) => {
    void id;
  }),
  error: "",
}));

vi.mock("@/hooks/useFavorites", () => ({
  useFavorites: () => state,
}));

beforeEach(() => {
  state.ids = [];
  state.isReady = true;
  state.error = "";
  state.toggle.mockClear();
});

describe("FavoriteButton", () => {
  it("propose d'ajouter un logement absent des favoris", () => {
    render(<FavoriteButton propertyId="logement-1" />);
    expect(screen.getByRole("button", { name: "Ajouter aux favoris" })).toHaveAttribute("aria-pressed", "false");
  });

  it("propose de retirer un logement déjà favori", () => {
    state.ids = ["logement-1"];
    render(<FavoriteButton propertyId="logement-1" />);
    expect(screen.getByRole("button", { name: "Retirer des favoris" })).toHaveAttribute("aria-pressed", "true");
  });

  it("transmet l'identifiant correct à toggle au clic", async () => {
    const user = userEvent.setup();
    render(<FavoriteButton propertyId="logement-42" />);
    await user.click(screen.getByRole("button", { name: "Ajouter aux favoris" }));
    expect(state.toggle).toHaveBeenCalledExactlyOnceWith("logement-42");
  });

  it("désactive le bouton pendant l'initialisation des favoris", () => {
    state.isReady = false;
    render(<FavoriteButton propertyId="logement-1" />);
    expect(screen.getByRole("button", { name: "Ajouter aux favoris" })).toBeDisabled();
  });
});
