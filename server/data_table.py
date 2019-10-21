import pandas as pd


def data_table(data, table_id='Table', idx_col=None):
    df = pd.DataFrame(data)
    if idx_col is not None:
        df.set_index(idx_col)
    html = df.to_html(table_id=table_id, index=False)
    scripts = f"""
<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/jq-3.3.1/dt-1.10.20/cr-1.5.2/kt-2.5.1/rr-1.2.6/sc-2.0.1/sl-1.3.1/datatables.min.css"/>
 
<script type="text/javascript" src="https://cdn.datatables.net/v/dt/jq-3.3.1/dt-1.10.20/cr-1.5.2/kt-2.5.1/rr-1.2.6/sc-2.0.1/sl-1.3.1/datatables.min.js"></script>

    <script>
    $(document).ready( function () {{
        $('#{table_id}').DataTable({{
                          ordering: true,
                          paging: false,
                          scrollY: 400,
                          select: true,
                          colReorder: true,
                          rowReorder: true,
                          keys: true,
        }});
    }} );
    </script>
    """
    return scripts + html
