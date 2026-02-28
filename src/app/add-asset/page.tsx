import AddAssetForm from "@/components/AddAsset/AddAssetForm"

const AddAssetPage = () => {
  return (
    <div className="mt-20">
      <div className="flex max-md:flex-col md:items-center justify-between p-8">
        <h1 className="text-4xl font-bold">Add Asset</h1>
        <p className="text-sm opacity-60 md:text-right max-md:mt-2">
          Add a new asset to the lending pool.
        </p>
      </div>
      <AddAssetForm />
    </div>
  )
}

export default AddAssetPage
