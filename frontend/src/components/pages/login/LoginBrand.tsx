import logo from '../../../assets/procobaja-sem-fundo.svg'

export function LoginBrand() {
	return (
		<section className="flex flex-col items-center bg-red px-6 py-10 text-center text-white sm:px-10 md:items-start md:text-left md:min-h-dvh md:w-[40.2%] md:shrink-0 md:px-[5.2%] md:pt-[118px]">
			<img
				src={logo}
				alt="ProcoBaja"
				width={72}
				height={72}
				className="h-[72px] w-[72px]"
			/>
			<h1 className="mt-9 text-3xl font-bold leading-tight sm:text-[42px]">
				ProcoBaja ERP
			</h1>
			<p className="mt-2 text-base text-red-soft sm:text-lg">
				Gestão integrada da equipe
			</p>
			<p className="mt-8 hidden max-w-sm text-sm leading-relaxed text-red-soft md:block md:mt-10 md:text-base">
				Um único lugar para organizar as operações do projeto.
			</p>
		</section>
	)
}
