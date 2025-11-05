import smiliinlogo from "../assets/logo.png"


type LoadingPageProps = {
  text: string;
  value:number
};

const LoadingPage = ({ text, value }: LoadingPageProps) => {
    return (
        <div className="bg-white flex flex-col items-center justify-center h-screen gap-2 absolute w-full z-50">
           <div>
                <img
                    src={smiliinlogo} 
                    alt="image"
                    className="h-50 w-50 object-contain"
                />
           </div>
           <div>
            <div className="w-40 bg-[#092731] rounded-full h-1"><div className="h-1 rounded-full bg-[#c10302]" style={{width: `${value}%`}}></div></div>
              {/* <progress className="progress progress-success w-56 bg-green-600" value="10" max="100"></progress> */}
           </div>
           <div><span className="text-[11px] font-semibold">{text} {value}%...</span></div>
        </div>
    );
}

export default LoadingPage;




export const DotsLoading: React.FC = () => {
  return (
    <svg
      className="h-5 w-12 text-gray-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 120 30"
    >
      <circle cx="15" cy="15" r="15">
        <animate
          attributeName="r"
          from="15"
          to="15"
          begin="0s"
          dur="0.8s"
          values="15;9;15"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fill-opacity"
          from="1"
          to="1"
          begin="0s"
          dur="0.8s"
          values="1;.5;1"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="60" cy="15" r="9" fillOpacity="0.3">
        <animate
          attributeName="r"
          from="9"
          to="9"
          begin="0.2s"
          dur="0.8s"
          values="9;15;9"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fill-opacity"
          from="0.5"
          to="0.5"
          begin="0.2s"
          dur="0.8s"
          values=".5;1;.5"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="105" cy="15" r="15">
        <animate
          attributeName="r"
          from="15"
          to="15"
          begin="0.4s"
          dur="0.8s"
          values="15;9;15"
          calcMode="linear"
          repeatCount="indefinite"
        />
        <animate
          attributeName="fill-opacity"
          from="1"
          to="1"
          begin="0.4s"
          dur="0.8s"
          values="1;.5;1"
          calcMode="linear"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};
