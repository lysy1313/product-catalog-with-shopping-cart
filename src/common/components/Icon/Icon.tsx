import IconsSprite from "../../assets/icons-sprite.svg";

type IconPropsType = {
  iconId?: string;
  width?: string;
  height?: string;
  viewBox?: string;
};

function dataURItoBlobUrl(dataURI: string) {
  const svg = decodeURI(dataURI).split(",")[1];
  const blob = new Blob([svg], { type: "image/svg+xml" });

  return URL.createObjectURL(blob);
}

const blobUrl = dataURItoBlobUrl(IconsSprite);

export const Icon = (props: IconPropsType) => {
  return (
    <svg
      width={props.width || "50"}
      height={props.height || "50"}
      viewBox={props.viewBox || "0 0 50 50"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <use xlinkHref={`${blobUrl}#${props.iconId}`} />
    </svg>
  );
};
