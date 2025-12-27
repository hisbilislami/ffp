import { Table, Text } from "@mantine/core";
import { ListTransaction } from "../columns";
import { convertToRupiah } from "~/utils/mooney";

const Summary = ({ data }: { data: ListTransaction[] }) => {
  const totalEstPrice = data.reduce(
    (accumulator, currentValue) => accumulator + currentValue.estimatePrice,
    0
  );
  const totalRealPrice = data.reduce(
    (accumulator, currentValue) => accumulator + currentValue.realPrice,
    0
  );
  const totalDiffPrice = data.reduce(
    (accumulator, currentValue) => accumulator + currentValue.diffPrice,
    0
  );

  return (
    <div className="grid grid-cols-3">
      <div className="bg-bill-orange-300 col-start-1 sm:col-start-3 p-3 rounded-lg w-[70vw] sm:w-full">
        <Text fw={700} className="my-3">
          Summary
        </Text>
        <Table className="table">
          <tbody>
            <tr>
              <td valign="top" className="text-nowrap">
                Total Estimate Price
              </td>
              <td width="50%" valign="top">
                {" "}
                <Text fw={600} size="sm">
                  {" "}
                  : {convertToRupiah(totalEstPrice)}
                </Text>
              </td>
            </tr>
            <tr>
              <td valign="top" className="text-nowrap">
                Total Real Price
              </td>
              <td width="50%" valign="top">
                {" "}
                <Text fw={600} size="sm">
                  {" "}
                  : {convertToRupiah(totalRealPrice)}
                </Text>
              </td>
            </tr>
            <tr>
              <td valign="top" className="text-nowrap">
                Total Different Price
              </td>
              <td width="50%" valign="top">
                {" "}
                <Text fw={600} size="sm">
                  : {convertToRupiah(totalDiffPrice)}{" "}
                </Text>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Summary;
