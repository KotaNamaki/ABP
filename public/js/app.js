$(document).ready(function() {
    let table;

    // 1. Cek apakah elemen tabel ada di halaman ini sebelum memanggil DataTable
    if ($('#tabelData').length > 0) {
        table = $('#tabelData').DataTable({
            ajax: {
                url: '/api/data',
                dataSrc: 'data'
            },
            columns: [
                { data: 'id' },
                { data: 'nama' },
                { data: 'nim' },
                { data: 'jurusan' },
                {
                    data: null,
                    render: function(data, type, row) {
                        return `
                            <button class="btn btn-warning btn-sm btn-edit" data-id="${row.id}" data-nama="${row.nama}" data-nim="${row.nim}" data-jurusan="${row.jurusan}">Edit</button>
                            <button class="btn btn-danger btn-sm btn-hapus" data-id="${row.id}">Hapus</button>
                        `;
                    }
                }
            ]
        });
    }

    // 2. CREATE (Berjalan di form.html)
    $('#formTambah').submit(function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/data',
            type: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                alert(res.message);
                $('#formTambah')[0].reset();
                // Reload tabel hanya jika kita sedang berada di halaman tabel
                if (table) {
                    table.ajax.reload();
                }
            },
            error: function(err) {
                alert("Gagal: " + err.responseJSON.error);
            }
        });
    });

    // 3. DELETE
    $('#tabelData tbody').on('click', '.btn-hapus', function() {
        let id = $(this).attr('data-id');
        if (confirm('Hapus data?')) {
            $.ajax({
                url: `/api/data/${id}`,
                type: 'DELETE',
                success: function(res) {
                    if (table) table.ajax.reload();
                }
            });
        }
    });

    // 4. UPDATE (Buka Modal)
    $('#tabelData tbody').on('click', '.btn-edit', function() {
        $('#editId').val($(this).attr('data-id'));
        $('#editNama').val($(this).attr('data-nama'));
        $('#editNim').val($(this).attr('data-nim'));
        $('#editJurusan').val($(this).attr('data-jurusan'));
        $('#modalEdit').modal('show');
    });

    // 5. UPDATE (Submit Edit)
    $('#formEdit').submit(function(e) {
        e.preventDefault();
        let id = $('#editId').val();
        $.ajax({
            url: `/api/data/${id}`,
            type: 'PUT',
            data: $(this).serialize(),
            success: function(res) {
                $('#modalEdit').modal('hide');
                if (table) table.ajax.reload();
            }
        });
    });
});