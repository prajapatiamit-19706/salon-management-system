export const WhyChooseUS =({curEle})=>{
    const {id,title,body} = curEle;
    return <li key={id} className="shadow-custom bg-bg-main p-10 rounded-2xl hover:-translate-y-2 transition duration-300">
        <div>
            <h1 className="text-[20px] text-text-heading font-semibold">{title} </h1>
            <p className="text-[16px] text-text-body mt-3">{body} </p>
        </div>
    </li>
}