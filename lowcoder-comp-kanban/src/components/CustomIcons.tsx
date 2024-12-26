const PriorityBacklogOutlined = ({ color }) => {
  return (
    <span
      role="img"
      aria-label="priority-backlog"
      className="anticon"
      style={{ color: color ? `${color}` : "#7C8697" }}
    >
      <svg
        width="1em"
        height="1em"
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="priority-backlog"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M534.386 708.382L905.068 418.268C909.5 414.859 912 409.518 912 403.95V316.109C912 308.496 903.25 304.291 897.341 308.95L512 610.541L126.659 308.95C125.319 307.901 123.711 307.25 122.019 307.072C120.326 306.893 118.618 307.195 117.089 307.941C115.56 308.688 114.271 309.85 113.372 311.295C112.472 312.739 111.996 314.407 112 316.109V403.95C112 409.518 114.614 414.859 118.932 418.268L489.5 708.382C502.796 718.723 521.205 718.723 534.386 708.382Z" />
      </svg>
    </span>
  );
};

const PriorityHighOutlined = ({ color }) => {
  return (
    <span
      role="img"
      aria-label="priority-high"
      className="anticon"
      style={{ color: color ? `${color}` : "#DB833C" }}
    >
      <svg
        width="1em"
        height="1em"
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="priority-high"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M489.614 314.756L118.932 604.869C114.5 608.278 112 613.619 112 619.188V707.028C112 714.642 120.75 718.847 126.659 714.187L512 412.597L897.341 714.187C898.681 715.237 900.289 715.888 901.981 716.066C903.674 716.245 905.382 715.943 906.911 715.196C908.44 714.449 909.729 713.287 910.628 711.843C911.528 710.399 912.004 708.73 912 707.028V619.188C912 613.619 909.386 608.278 905.068 604.869L534.5 314.756C521.205 304.415 502.795 304.415 489.614 314.756Z" />
      </svg>
    </span>
  );
};

const PriorityNormalOutlined = ({ color }) => {
  return (
    <span
      role="img"
      aria-label="priority-normal"
      className="anticon"
      style={{ color: color ? `${color}` : "#F2AE3D" }}
    >
      <svg
        width="1em"
        height="1em"
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="priority-normal"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M904 370H120C115.6 370 112 373.6 112 378V434C112 438.4 115.6 442 120 442H904C908.4 442 912 438.4 912 434V378C912 373.6 908.4 370 904 370Z" />
        <path d="M904 582H120C115.6 582 112 585.6 112 590V646C112 650.4 115.6 654 120 654H904C908.4 654 912 650.4 912 646V590C912 585.6 908.4 582 904 582Z" />
      </svg>
    </span>
  );
};

const PriorityUrgentOutlined = ({ color }) => {
  return (
    <span
      role="img"
      aria-label="priority-urgent"
      className="anticon"
      style={{ color: color ? `${color}` : "#BC271A" }}
    >
      <svg
        width="1em"
        height="1em"
        viewBox="64 64 896 896"
        focusable="false"
        data-icon="priority-urgent"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M489.614 488.618L118.932 778.732C114.5 782.141 112 787.482 112 793.05V880.891C112 888.504 120.75 892.709 126.659 888.05L512 586.459L897.341 888.05C898.681 889.099 900.289 889.75 901.981 889.928C903.674 890.107 905.382 889.805 906.911 889.058C908.44 888.312 909.729 887.15 910.628 885.705C911.528 884.261 912.004 882.592 912 880.891V793.05C912 787.482 909.386 782.141 905.068 778.732L534.5 488.618C521.205 478.277 502.795 478.277 489.614 488.618ZM489.614 143.163L118.932 433.277C114.5 436.686 112 442.027 112 447.595V535.436C112 543.05 120.75 547.254 126.659 542.595L512 241.004L897.341 542.595C898.681 543.644 900.289 544.295 901.981 544.474C903.674 544.652 905.382 544.351 906.911 543.604C908.44 542.857 909.729 541.695 910.628 540.251C911.528 538.806 912.004 537.138 912 535.436V447.595C912 442.027 909.386 436.686 905.068 433.277L534.5 143.163C521.205 132.822 502.795 132.822 489.614 143.163Z" />
      </svg>
    </span>
  );
};

export {
  PriorityBacklogOutlined,
  PriorityHighOutlined,
  PriorityNormalOutlined,
  PriorityUrgentOutlined
};
