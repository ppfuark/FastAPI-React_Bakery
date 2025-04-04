export default function Form({ campos, title, LinkTo, ButtonText, onSubmit, disabled }) {
  return (
    <div className="bg-[#3E2C24] rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold text-[#D7B899] mb-6">{title}</h2>
      
      <form onSubmit={onSubmit} className="space-y-4">
        {campos.map((campo, index) => (
          <div key={index}>
            <label htmlFor={campo.id} className="block text-sm font-medium text-[#D7B899] mb-1">
              {campo.label}
              {campo.required && <span className="text-red-400">*</span>}
            </label>
            <input
              type={campo.type}
              id={campo.id}
              name={campo.name}
              placeholder={campo.placeholder}
              required={campo.required}
              min={campo.min}
              step={campo.step}
              className="w-full px-3 py-2 border border-[#8B6A52] bg-[#2E1B12] text-[#D7B899] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8B6A52]"
              disabled={disabled}
            />
          </div>
        ))}

        <div className="flex justify-between mt-6">
          <a
            href={LinkTo}
            className="px-4 py-2 border border-[#8B6A52] rounded-md text-[#D7B899] hover:bg-[#4A3226] transition"
          >
            Cancel
          </a>
          <button
            type="submit"
            disabled={disabled}
            className="px-4 py-2 bg-[#5A3E30] text-[#D7B899] rounded-md hover:bg-[#8B6A52] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {ButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}
 