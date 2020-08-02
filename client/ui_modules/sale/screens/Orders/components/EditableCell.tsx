import React from 'react';
import {  Input, InputNumber, Form } from 'antd';

export const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    // tslint:disable-next-line: trailing-comma
    ...restProps
  }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            // rules={[
            //   {
            //     required: dataIndex === 'name' ? true : false,
            //     message: `${title} không được bỏ trống!`,
            //   },
            // ]}

          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
};
