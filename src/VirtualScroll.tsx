/**@jsx jsx */
import { useRef, useEffect, useCallback, useState } from "react";
import { jsx, css } from "@emotion/core";

import DisplayItems from "./DisplayItems";

const viewboxStyle = css`
  width: 300px;
  height: 400px;
  border: 1px solid black;
  overflow: scroll;
`;

interface ContentProps {
  itemCount: number;
  itemHeight: string;
}
const contentStyle = ({ itemCount, itemHeight }: ContentProps) => css`
  height: calc(${itemHeight} * ${itemCount});
  width: 100%;
  font-size: 16px;
  background-image: linear-gradient(skyblue, yellow);
  position: relative;
`;

const PROTECT_UPPER_ITEM_SIZE = 1;

interface Props<T> {
  data: Array<T>;
  itemHeight: string;
  itemSize: number;
}
function VirtualScroll<T>({ data, itemHeight, itemSize }: Props<T>) {
  const [firstItem, setFirstItem] = useState(0);
  const [displayItems, setDisplayItems] = useState([{}]);
  const viewboxRef = useRef<HTMLDivElement>(null);
  const itemCount = data.length;

  const onScroll = useCallback(() => {
    const viewboxElement = viewboxRef.current || null;
    const scrollTop = viewboxElement ? viewboxElement.scrollTop : 0;
    const nextFirstItem = Math.ceil(
      scrollTop / parseInt((itemHeight.match(/\d+/g) || []).join(""), 10)
    );

    if (firstItem !== nextFirstItem) {
      setFirstItem(nextFirstItem);
    }
  }, [firstItem, itemHeight]);

  const setItems = useCallback(() => {
    const result = data.reduce(
      (pv, cv, index) =>
        index >= firstItem - PROTECT_UPPER_ITEM_SIZE &&
        index <= firstItem + itemSize
          ? [...pv, { key: index, value: cv }]
          : pv,
      [] as any
    );
    setDisplayItems(result);
  }, [firstItem, data, itemSize]);

  useEffect(() => {
    const viewboxElement = viewboxRef.current || null;
    setItems();
    if (viewboxElement) {
      viewboxElement.addEventListener("scroll", onScroll);
    }
    return () => {
      if (viewboxElement) {
        viewboxElement.removeEventListener("scroll", onScroll);
      }
    };
  }, [onScroll, setItems]);

  return (
    <section>
      <div css={viewboxStyle} ref={viewboxRef}>
        <div css={contentStyle({ itemCount, itemHeight })}>
          <DisplayItems items={displayItems} itemHeight={itemHeight} />
        </div>
      </div>
    </section>
  );
}

export default VirtualScroll;
