function NewsCard({ item }) {
  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <img src={item.image} alt={item.title} className="h-40 w-full object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
        <p className="mt-3 text-sm leading-6 text-gray-500">{item.description}</p>
        <p className="mt-4 text-xs text-gray-400">{item.date}</p>
      </div>
    </article>
  )
}

export default NewsCard
