import { useTranslation } from "../hooks/UseLanguage"

export const Loading = () => {
    const { t } = useTranslation()
    return (
        <div className='flex w-full h-screen items-center justify-center'>
            <div className="flex flex-col gap-3">
                <div className="loader">
                    <svg
                        id="pegtopone"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 100 100"
                    >
                        <defs>
                            <filter id="shine">
                                <feGaussianBlur stdDeviation="3"></feGaussianBlur>
                            </filter>
                            <mask id="mask">
                                <path
                                    d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                    fill="white"
                                ></path>
                            </mask>
                            <radialGradient
                                id="gradient-1"
                                cx="50"
                                cy="66"
                                fx="50"
                                fy="66"
                                r="30"
                                gradientTransform="translate(0 35) scale(1 0.5)"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0%" stopColor="black" stopOpacity="0.3"></stop>
                                <stop offset="50%" stopColor="black" stopOpacity="0.1"></stop>
                                <stop offset="100%" stopColor="black" stopOpacity="0"></stop>
                            </radialGradient>
                            <radialGradient
                                id="gradient-2"
                                cx="55"
                                cy="20"
                                fx="55"
                                fy="20"
                                r="30"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0%" stopColor="white" stopOpacity="0.3"></stop>
                                <stop offset="50%" stopColor="white" stopOpacity="0.1"></stop>
                                <stop offset="100%" stopColor="white" stopOpacity="0"></stop>
                            </radialGradient>
                            <radialGradient
                                id="gradient-3"
                                cx="85"
                                cy="50"
                                fx="85"
                                fy="50"
                                xlinkHref="#gradient-2"
                            ></radialGradient>
                            <radialGradient
                                id="gradient-4"
                                cx="50"
                                cy="58"
                                fx="50"
                                fy="58"
                                r="60"
                                gradientTransform="translate(0 47) scale(1 0.2)"
                                xlinkHref="#gradient-3"
                            ></radialGradient>
                            <linearGradient
                                id="gradient-5"
                                x1="50"
                                y1="90"
                                x2="50"
                                y2="10"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0%" stopColor="black" stopOpacity="0.2"></stop>
                                <stop offset="40%" stopColor="black" stopOpacity="0"></stop>
                            </linearGradient>
                        </defs>
                        <g>
                            <path
                                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                fill="currentColor"
                            ></path>
                            <path
                                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                fill="url(#gradient-1)"
                            ></path>
                            <path
                                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                fill="none"
                                stroke="white"
                                opacity="0.3"
                                strokeWidth="3"
                                filter="url(#shine)"
                                mask="url(#mask)"
                            ></path>
                            <path
                                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                fill="url(#gradient-2)"
                            ></path>
                            <path
                                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                fill="url(#gradient-3)"
                            ></path>
                            <path
                                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                fill="url(#gradient-4)"
                            ></path>
                            <path
                                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                fill="url(#gradient-5)"
                            ></path>
                        </g>
                    </svg>
                    <svg
                        id="pegtoptwo"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 100 100"
                    >
                        <defs>
                            <filter id="shine">
                                <feGaussianBlur stdDeviation="3"></feGaussianBlur>
                            </filter>
                            <mask id="mask">
                                <path
                                    d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                    fill="white"
                                ></path>
                            </mask>
                            <radialGradient
                                id="gradient-1"
                                cx="50"
                                cy="66"
                                fx="50"
                                fy="66"
                                r="30"
                                gradientTransform="translate(0 35) scale(1 0.5)"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0%" stopColor="black" stopOpacity="0.3"></stop>
                                <stop offset="50%" stopColor="black" stopOpacity="0.1"></stop>
                                <stop offset="100%" stopColor="black" stopOpacity="0"></stop>
                            </radialGradient>
                            <radialGradient
                                id="gradient-2"
                                cx="55"
                                cy="20"
                                fx="55"
                                fy="20"
                                r="30"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0%" stopColor="white" stopOpacity="0.3"></stop>
                                <stop offset="50%" stopColor="white" stopOpacity="0.1"></stop>
                                <stop offset="100%" stopColor="white" stopOpacity="0"></stop>
                            </radialGradient>
                            <radialGradient
                                id="gradient-3"
                                cx="85"
                                cy="50"
                                fx="85"
                                fy="50"
                                xlinkHref="#gradient-2"
                            ></radialGradient>
                            <radialGradient
                                id="gradient-4"
                                cx="50"
                                cy="58"
                                fx="50"
                                fy="58"
                                r="60"
                                gradientTransform="translate(0 47) scale(1 0.2)"
                                xlinkHref="#gradient-3"
                            ></radialGradient>
                            <linearGradient
                                id="gradient-5"
                                x1="50"
                                y1="90"
                                x2="50"
                                y2="10"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0%" stopColor="black" stopOpacity="0.2"></stop>
                                <stop offset="40%" stopColor="black" stopOpacity="0"></stop>
                            </linearGradient>
                        </defs>
                        <g>
                            <path
                                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                fill="currentColor"
                            ></path>
                            <path
                                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                fill="url(#gradient-1)"
                            ></path>
                            <path
                                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                fill="none"
                                stroke="white"
                                opacity="0.3"
                                strokeWidth="3"
                                filter="url(#shine)"
                                mask="url(#mask)"
                            ></path>
                            <path
                                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                fill="url(#gradient-2)"
                            ></path>
                            <path
                                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                fill="url(#gradient-3)"
                            ></path>
                            <path
                                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                fill="url(#gradient-4)"
                            ></path>
                            <path
                                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                fill="url(#gradient-5)"
                            ></path>
                        </g>
                    </svg>
                    <svg
                        id="pegtopthree"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 100 100"
                    >
                        <defs>
                            <filter id="shine">
                                <feGaussianBlur stdDeviation="3"></feGaussianBlur>
                            </filter>
                            <mask id="mask">
                                <path
                                    d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                    fill="white"
                                ></path>
                            </mask>
                            <radialGradient
                                id="gradient-1"
                                cx="50"
                                cy="66"
                                fx="50"
                                fy="66"
                                r="30"
                                gradientTransform="translate(0 35) scale(1 0.5)"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0%" stopColor="black" stopOpacity="0.3"></stop>
                                <stop offset="50%" stopColor="black" stopOpacity="0.1"></stop>
                                <stop offset="100%" stopColor="black" stopOpacity="0"></stop>
                            </radialGradient>
                            <radialGradient
                                id="gradient-2"
                                cx="55"
                                cy="20"
                                fx="55"
                                fy="20"
                                r="30"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0%" stopColor="white" stopOpacity="0.3"></stop>
                                <stop offset="50%" stopColor="white" stopOpacity="0.1"></stop>
                                <stop offset="100%" stopColor="white" stopOpacity="0"></stop>
                            </radialGradient>
                            <radialGradient
                                id="gradient-3"
                                cx="85"
                                cy="50"
                                fx="85"
                                fy="50"
                                xlinkHref="#gradient-2"
                            ></radialGradient>
                            <radialGradient
                                id="gradient-4"
                                cx="50"
                                cy="58"
                                fx="50"
                                fy="58"
                                r="60"
                                gradientTransform="translate(0 47) scale(1 0.2)"
                                xlinkHref="#gradient-3"
                            ></radialGradient>
                            <linearGradient
                                id="gradient-5"
                                x1="50"
                                y1="90"
                                x2="50"
                                y2="10"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop offset="0%" stopColor="black" stopOpacity="0.2"></stop>
                                <stop offset="40%" stopColor="black" stopOpacity="0"></stop>
                            </linearGradient>
                        </defs>
                        <g>
                            <path
                                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                fill="currentColor"
                            ></path>
                            <path
                                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                fill="url(#gradient-1)"
                            ></path>
                            <path
                                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                fill="none"
                                stroke="white"
                                opacity="0.3"
                                strokeWidth="3"
                                filter="url(#shine)"
                                mask="url(#mask)"
                            ></path>
                            <path
                                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                fill="url(#gradient-2)"
                            ></path>
                            <path
                                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                fill="url(#gradient-3)"
                            ></path>
                            <path
                                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                fill="url(#gradient-4)"
                            ></path>
                            <path
                                d="M63,37c-6.7-4-4-27-13-27s-6.3,23-13,27-27,4-27,13,20.3,9,27,13,4,27,13,27,6.3-23,13-27,27-4,27-13-20.3-9-27-13Z"
                                fill="url(#gradient-5)"
                            ></path>
                        </g>
                    </svg>
                </div>
                <div
                    data-text={t('loading')}
                    className="loader_2 mt-15"></div>
            </div>
        </div>
    )
}
