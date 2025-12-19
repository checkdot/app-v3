import RewardList from "@/components/RewardList"

const RewardsPage = () => {
  return (
    <div className="mt-20">
      <div className="flex max-md:flex-col md:items-center justify-between p-8">
        <h1 className="text-4xl font-bold">Rewards</h1>
        <p className="text-sm opacity-60 md:text-right max-md:mt-2">
          Rewards for depositing and borrowing on CheckDot Lending.
        </p>
      </div>
      <RewardList />
    </div>
  )
}

export default RewardsPage
