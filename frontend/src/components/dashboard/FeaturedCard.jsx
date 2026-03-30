function FeaturedCard({ item }) {
  return (
    <article className="overflow-hidden rounded-xl bg-white shadow-md transition-all duration-300 hover:shadow-xl">
      <img src={item.image} alt={item.title} className="h-64 w-full object-cover" />
      <div className="p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-green-600">{item.category}</p>
        <h2 className="mt-3 text-2xl font-bold text-gray-900">{item.title}</h2>
        <p className="mt-4 text-sm leading-7 text-gray-500">{item.description}</p>
        <p className="mt-5 text-sm text-gray-400">
          {item.date} • {item.source}
        </p>
      </div>
    </article>
  )
}

export default FeaturedCard
