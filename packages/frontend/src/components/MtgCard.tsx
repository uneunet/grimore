export function MtgCard({ name, imageUri, amounts }: { name: string, imageUri: string, amounts: number }) {
  return (
    <div className="relative h-36">
      <img src={imageUri} alt={name} /> 
      <p className="bg-black text-white text-sm rounded-br-lg px-1 absolute bottom-0 right-0">x{amounts}</p>
    </div>
  )
}
