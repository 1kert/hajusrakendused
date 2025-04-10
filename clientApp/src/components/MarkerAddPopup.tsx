export default function MarkerAddPopup(
    props: {
        onClose: () => void,
    }
) {
    return (
        <div className="absolute left-0 top-0 z-50 w-full h-screen bg-[#00000090] flex items-center justify-center">
            <div className="bg-white p-6">
                <p onClick={() => props.onClose()}>popup</p>
            </div>
        </div>
    )
}
