interface ErrorMessageProps {
    children:React.ReactNode
}
export default function ErrorMessage({children} : ErrorMessageProps) {
//export default function ErrorMessage({children} : {children:React.ReactNode}) {

    return (
        <p className="text-center  p-2 bg-red-200 text-red-600 uppercase">{children}</p>
    )
}
