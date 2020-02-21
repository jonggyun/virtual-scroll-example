import * as React from "react";

import VirtualScroll from "./VirtualScroll";

const data = [...Array(50000)] as [];
const itemHeight = "50px" as string;
const itemSize = 10 as number;

export default function App() {
  return (
    <div>
      <VirtualScroll data={data} itemHeight={itemHeight} itemSize={itemSize} />
    </div>
  );
}
