export const convertToRupiah = (n: number | bigint) => {
  const rupiah = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(n);

  return rupiah;
};
