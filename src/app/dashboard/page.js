"use client"
import { Metadata } from "next";
import { useRouter } from "next/navigation";
// export const metadata: Metadata = {
// 	title: 'Dashboard',
// 	description: 'Qafila Travels Dashboard',
// }

export default function Page() {
	const router=useRouter()
  const cardsArray = [
    {
      title: "Expense Management",
      heading: "",
      description: "Cash Reimbursement & Advance Cash Request ",
      button: "Detail",
	  link:"/dashboard/cash"
    },
    {
      title: "Leave Management",
      heading: "",
      description: "Apply for Leave ",
      button: "Detail",
	  link:"/dashboard/leaves"

    },
    {
      title: "Time Off Management",
      heading: "",
      description: "Apply and Check Status for Time Off",
      button: "Detail",
	  link:"/dashboard/passOut"

    },
    {
      title: "Invoice Management",
      heading: "",
      description: "Invoice Creation, Tracking, and Approval",
      button: "Detail",
	  link:"/dashboard/invoices"

    },
  ];
  return (
    <div className="flex flex-1 flex-col">
      <h2 className="text-center font-bold text-2xl mb-3">Dashboard</h2>
	<div className="flex flex-wrap justify-around gap-[50px]">

      {cardsArray.map((card, i) => {
        return (
          <div className="max-w-sm h-[200px] w-[300px] rounded overflow-hidden shadow-lg" key={i}>
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2 text-center">{card.title}</div>
              <p className="text-gray-700 text-base text-center">{card.heading}</p>
              <p className="text-gray-700 text-base text-center">{card.description}</p>
            </div>
            <div className="px-6 py-4 text-center">
              <button onClick={()=>router.push(card.link)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                {card.button}
              </button>
            </div>
          </div>
        );
      })}
	</div>

    </div>
  );
}
