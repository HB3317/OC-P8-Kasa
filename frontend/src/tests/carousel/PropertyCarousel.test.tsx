import { createElement } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import PropertyCarousel from "@/components/molecules/PropertyCarousel/PropertyCarousel";

// Le test porte sur le carrousel, pas sur l'optimisation des images Next.js.
vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) =>
    createElement("img", { src, alt }),
}));

// La visionneuse dispose de ses propres interactions : on l'isole ici.
vi.mock("@/components/molecules/PropertyLightbox/PropertyLightbox", () => ({
  default: () => null,
}));

const mainImage = "/photo-1.jpg";
const images = [mainImage, "/photo-2.jpg", "/photo-3.jpg"];

function renderCarousel(pictures: string[] = images) {
  return render(<PropertyCarousel images={pictures} title="Maison témoin" />);
}

describe("PropertyCarousel", () => {
  it("affiche la première image et le compteur", () => {
    renderCarousel();
    const mainPictureButton = screen.getByRole("button", { name: "Agrandir la photo principale" });
    const displayedImage = within(mainPictureButton).getByRole("img", { name: "Maison témoin — photo 1 sur 3" });
    expect(displayedImage).toHaveAttribute("src", mainImage);
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("affiche l'image suivante au clic", async () => {
    const user = userEvent.setup();
    renderCarousel();
    await user.click(screen.getByRole("button", { name: "Photo suivante" }));
    expect(screen.getByAltText("Maison témoin — photo 2 sur 3")).toBeInTheDocument();
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("revient à l'image précédente", async () => {
    const user = userEvent.setup();
    renderCarousel();
    await user.click(screen.getByRole("button", { name: "Photo suivante" }));
    await user.click(screen.getByRole("button", { name: "Photo précédente" }));
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("revient à la première image après la dernière", async () => {
    const user = userEvent.setup();
    renderCarousel();
    for (let i = 0; i < images.length; i++) {
      await user.click(screen.getByRole("button", { name: "Photo suivante" }));
    }
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("masque les flèches quand il n'existe qu'une image", () => {
    renderCarousel([images[0]]);
    expect(screen.queryByRole("button", { name: "Photo suivante" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Photo précédente" })).not.toBeInTheDocument();
    expect(screen.getByAltText("Maison témoin — photo 1 sur 1")).toBeInTheDocument();
  });

  it("affiche une indication quand aucune image n'est disponible", () => {
    renderCarousel([]);
    expect(screen.getByText("Photo indisponible")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Photo suivante" })).not.toBeInTheDocument();
  });
});
