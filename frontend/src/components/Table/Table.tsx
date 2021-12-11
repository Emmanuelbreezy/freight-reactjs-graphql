import React,{useMemo} from 'react';
import { Link } from 'react-router-dom';


import { useTable,useSortBy } from 'react-table';

interface TableProps{
    shipments:[{}];
}

export default function Table({shipments}:TableProps) {
    const data = React.useMemo(
        () => [...shipments],[shipments]
    )
    
    const columns = React.useMemo(
        () => 
          shipments[0] 
              ? Object.keys(shipments[0])
                      .filter((key) => key != '')
                      .map((key)=>{
                        if(key === 'status')
                          return{
                            Header:key,
                            accessor:key,
                            Cell: ({value}:any) => {
                              return <a className={`btn ${value === 'COMPLETED'? "status-completed" : "status-active"}`}>{value}</a>
                            }
                          };
                         
                      return {Header:key, accessor:key}
                      })
            :[],
       [shipments]
      );

      const typeAction = (id:String) => ( <Link to={`/shipment/${id}`} className="btn act btn-outline d-flex align-items-center">
                            <span>Detail</span>
                            <svg style={{width:"12px",height:"12px"}} className="ms-1" version="1.1" id="Chevron_thin_right" xmlns="http://www.w3.org/2000/svg"  x="0px"
                                y="0px" viewBox="0 0 20 20" fill="#333" enableBackground="new 0 0 20 20">
                            <path d="M13.25,10L6.109,2.58c-0.268-0.27-0.268-0.707,0-0.979c0.268-0.27,0.701-0.27,0.969,0l7.83,7.908
                                c0.268,0.271,0.268,0.709,0,0.979l-7.83,7.908c-0.268,0.271-0.701,0.27-0.969,0c-0.268-0.269-0.268-0.707,0-0.979L13.25,10z"/>
                            </svg>
                            </Link>
                        )

      const tableHooks = (hooks:any)  => {
        hooks.visibleColumns.push((columns:any) => [
          ...columns,
          {
            id:'Action',
            Header:'Action',
            Cell: ({row}:any) => {
             return typeAction(row.values.id);
            }
          }
        ])
      }

      const isEven = (idx:any) => idx % 2 === 0;
    
      const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable({ columns:columns, data:data }, 
            tableHooks,
            useSortBy
        );
    
    
     return (
         <div className="table-responsive">

        <table className="table table-hover table-striped  table-borderless" {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render('Header')}
                    {column.isSorted ? (column.isSortedDesc ? "▼" : "▲"): ""}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="tbody" {...getTableBodyProps()}>
            {rows.map((row,idx) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td
                        {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
     </table>
     </div>
     

   )
}
