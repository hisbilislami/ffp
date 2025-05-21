import { Image, Text } from "@mantine/core";
import { Outlet } from "@remix-run/react";
import { AiTwotoneMoneyCollect } from "react-icons/ai";
import { GiFarmTractor } from "react-icons/gi";
import { RiSecurePaymentFill } from "react-icons/ri";
import { GiPlantWatering } from "react-icons/gi";

const AuthenticationLayout = () => {
  return (
    <div className="relative overflow-x-hidden overflow-y-hidden h-screen bill-layout md:grid lg:max-w-none lg:grid-cols-6 bg-bill-orange-100 p-4">
      <div className="lg:p-4 lg:col-span-3 hidden lg:grid grid-cols-3 gap-3 bg-white h-[97%] rounded-xl">
        <div className="col-span-1 flex flex-col gap-y-3">
          <div className="overflow-hidden h-[21%]">
            <Image
              src="https://plus.unsplash.com/premium_photo-1666739087726-3aadc2376c28"
              className="rounded-r-[20px] rounded-bl-[20px] object-cover w-full h-full"
            />
          </div>
          <div className="overflow-hidden h-[24.5%]">
            <Image
              src="https://images.unsplash.com/photo-1593672715438-d88a70629abe"
              className="rounded-r-[20px] rounded-bl-[20px] object-cover w-full h-full"
            />
          </div>
          <div className="h-[24.5%] bg-[var(--mantine-color-gray-0)] rounded-r-[20px] flex flex-col items-start justify-end p-5">
            <AiTwotoneMoneyCollect className="w-11 h-11" />
            <Text fz={18} fw={900} c="dark.3" className="leading-5 mt-2">
              Financial Planning
            </Text>
            <Text fz={14} fw={300} c="dark.2" className="leading-5 mt-1">
              Manage your expences
            </Text>
          </div>
          <div className="overflow-hidden h-[30%]">
            <Image
              src="https://images.unsplash.com/photo-1562564055-71e051d33c19"
              className="rounded-r-[20px] rounded-bl-[20px] object-cover w-full h-full"
            />
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-y-3">
          <div className="h-[24.5%] bg-[var(--mantine-color-gray-0)] rounded-[20px] flex flex-col items-start justify-end p-5">
            <GiFarmTractor className="h-11 w-11" />
            <Text fz={18} fw={900} c="dark.3" className="leading-5 mt-2">
              Farming Planning
            </Text>
            <Text fz={14} fw={300} c="dark.2" className="leading-5 mt-1">
              Manage your farm
            </Text>
          </div>
          <div className="h-[24.5%] rounded-[20px] flex flex-col items-start justify-end border border-[var(--mantine-color-gray-2)]">
            <div className="bg-white p-3 rounded-t-[20px] flex gap-2 w-full">
              <span className="h-3 w-3 bg-tm-blue-600 rounded-full"></span>
              <span className="h-3 w-3 bg-[var(--mantine-color-gray-3)] rounded-full"></span>
              <span className="h-3 w-3 bg-tm-green-600 rounded-full"></span>
            </div>

            <div className="bg-[var(--mantine-color-gray-0)] h-full w-full flex-col flex p-3 rounded-b-[20px] gap-2">
              <div className="bg-white w-full p-3 flex items-center shadow rounded-[20px] gap-2">
                <span className="h-6 w-6 bg-[var(--mantine-color-gray-3)] rounded-full"></span>
                <span className="flex-1 h-2 bg-[var(--mantine-color-gray-3)] rounded-full"></span>
              </div>

              <div className="bg-white w-full p-3 flex items-center shadow rounded-[20px] gap-2">
                <span className="h-6 w-6 bg-[var(--mantine-color-gray-3)] rounded-full"></span>
                <span className="flex-1 h-2 bg-[var(--mantine-color-gray-3)] rounded-full"></span>
              </div>
            </div>
          </div>
          <div className="overflow-hidden h-[30%]">
            <Image
              src="https://images.unsplash.com/photo-1589330694653-ded6df03f754"
              className="rounded-[20px] object-cover w-full h-full"
            />
          </div>
          <div className="h-[21%] rounded-[20px] flex flex-col items-start justify-end border border-[var(--mantine-color-gray-2)]">
            <div className="bg-white p-3 rounded-t-[20px] flex gap-2 w-full">
              <span className="h-3 w-3 bg-tm-blue-600 rounded-full"></span>
              <span className="h-3 w-3 bg-[var(--mantine-color-gray-3)] rounded-full"></span>
              <span className="h-3 w-3 bg-tm-green-600 rounded-full"></span>
            </div>

            <div className="bg-[var(--mantine-color-gray-0)] h-full w-full flex-col flex p-3 rounded-b-[20px] gap-2">
              <div className="bg-white w-full p-3 flex items-center shadow rounded-[20px] gap-2">
                <span className="h-6 w-6 bg-[var(--mantine-color-gray-3)] rounded-full"></span>
                <span className="flex-1 h-2 bg-[var(--mantine-color-gray-3)] rounded-full"></span>
              </div>

              <div className="bg-white w-full p-3 flex items-center shadow rounded-[20px] gap-2">
                <span className="h-6 w-6 bg-[var(--mantine-color-gray-3)] rounded-full"></span>
                <span className="flex-1 h-2 bg-[var(--mantine-color-gray-3)] rounded-full"></span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-y-3">
          <div className="overflow-hidden h-[13.5%] bg-[var(--mantine-color-gray-0)] rounded-l-[20px] rounded-tr-[20px] flex items-center justify-center">
            <div className="h-14 bg-gradient-to-l from-bill-gray-200 to-bill-gray-100 w-full inline-flex justify-center items-center">
              <GiPlantWatering className="h-11 w-11" />
            </div>
          </div>
          <div className="overflow-hidden h-[27%]">
            <Image
              src="https://images.unsplash.com/photo-1742240434042-11a13f062673"
              className="rounded-l-[20px] object-cover w-full h-full"
            />
          </div>
          <div className="h-[24.5%] bg-[var(--mantine-color-gray-0)] rounded-l-[20px] flex flex-col items-start justify-end p-5">
            <RiSecurePaymentFill className="h-11 w-11" />
            <Text fz={18} fw={900} c="dark.3" className="leading-5 mt-2">
              Secure
            </Text>
            <Text fz={14} fw={300} c="dark.2" className="leading-5 mt-1">
              Secure your financial planning
            </Text>
          </div>
          <div className="overflow-hidden h-[35%]">
            <Image
              src="https://images.unsplash.com/photo-1728044849280-10a1a75cff83"
              className="rounded-l-[20px] rounded-br-[20px] object-cover w-full h-full"
            />
          </div>
        </div>
      </div>

      <div className="relative lg:col-span-3 h-full flex-col flex">
        <div className="w-full h-full z-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthenticationLayout;
