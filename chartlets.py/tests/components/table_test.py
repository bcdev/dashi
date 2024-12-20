from chartlets.components.table import Table
from tests.component_test import make_base


class TableTest(make_base(Table)):
    def test_is_json_serializable(self):
        columns = [
            {"field": "id", "headerName": "ID"},
            {"field": "firstName", "headerName": "First Name"},
            {"field": "lastName", "headerName": "Last Name"},
            {"field": "age", "headerName": "Age"},
        ]
        rows = [
            {"id": 1, "firstName": "John", "lastName": "Doe", "age": 30},
            {"id": 2, "firstName": "Jane", "lastName": "Smith", "age": 25},
        ]
        self.assert_is_json_serializable(
            self.cls(rows=rows, columns=columns, id="my-table", checkboxSelection=True),
            {
                "type": "Table",
                "id": "my-table",
                "rows": rows,
                "columns": columns,
                "checkboxSelection": True,
            },
        )
