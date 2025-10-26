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
      <div className="bg-bill-orange-300 col-start-3 p-3 rounded-lg">
        <Text fw={700} className="my-3">
          Summary
        </Text>
        <Table className="table">
          <tbody>
            <tr>
              <td>Total Estimate Price</td>
              <td width="50%"> : {convertToRupiah(totalEstPrice)}</td>
            </tr>
            <tr>
              <td>Total Real Price</td>
              <td width="50%"> : {convertToRupiah(totalRealPrice)}</td>
            </tr>
            <tr>
              <td>Total Different Price</td>
              <td width="50%"> : {convertToRupiah(totalDiffPrice)}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Summary;
