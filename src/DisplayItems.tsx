/**@jsx jsx */
import * as React from "react";
import { jsx, css } from "@emotion/core";

interface ItemProps {
  itemHeight: string;
  index: number;
}
const itemStyle = ({ itemHeight, index }: ItemProps) => css`
  display: flex;
  align-items: center;
  height: ${itemHeight};
  position: absolute;
  width: 100%;
  top: calc(${itemHeight} * ${index});
  border-bottom: 1px solid black;
`;

interface Props<T> {
  items: Array<T>;
  itemHeight: string;
}
function DisplayItems<T>({ items, itemHeight }: Props<T>) {
  return (
    <React.Fragment>
      {items.map((item: any) => (
        <div
          key={JSON.stringify(item)}
          css={itemStyle({ itemHeight, index: item.key })}
        >
          <span>테스트 #{item.key}</span>
        </div>
      ))}
    </React.Fragment>
  );
}

export default React.memo(DisplayItems);
