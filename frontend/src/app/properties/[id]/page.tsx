import { notFound } from "next/navigation";
import { getProperty } from "@/services/propertyService";
import PropertyDetailTemplate from "@/components/templates/PropertyDetailTemplate";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) notFound();

  return <PropertyDetailTemplate property={property} />;
}
