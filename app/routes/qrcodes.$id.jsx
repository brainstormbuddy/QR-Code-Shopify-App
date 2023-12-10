import { json } from "@remix-run/node";
import invariant from "tiny-invariant";
import { useNavigate, useParams, useLoaderData, Link } from "@remix-run/react";

import db from "../db.server";
import { getQRCodeImage } from "~/models/QRCode.server";

export const loader = async ({ params }) => {
  invariant(params.id, "Could not find QR code destination");

  const id = Number(params.id);
  const qrCode = await db.qRCode.findFirst({ where: { id } });

  invariant(qrCode, "Could not find QR code destination");

  return json({
    title: qrCode.title,
    image: await getQRCodeImage(id),
  });
};

export default function QRCode() {
  const { image, title } = useLoaderData();
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <>
      <h1>{title}</h1>
      <img src={image} alt={`QR Code for product`} />
      <Link to={`/qrcodes/${id}/scan`}>Scan</Link>
    </>
  );
}
