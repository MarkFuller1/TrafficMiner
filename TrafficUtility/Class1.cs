namespace TrafficUtility
{
    using IronXL;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;

    /// <summary>
    /// Defines the <see cref="IronXLSM" />.
    /// </summary>
    internal class IronXLSM
    {
        /// <summary>
        /// Defines the _resource_path.
        /// </summary>
        public static string _resource_path = @"C:\Users\Mark Fuller\Desktop\Senior\DM\traffic\resources\RawData\2019\8_0.xlsm";

        /// <summary>
        /// Defines the _resource_dir.
        /// </summary>
        public static string _resource_dir = @"C:\Users\Mark Fuller\Desktop\Senior\DM\traffic\resources\RawData";

        /// <summary>
        /// Defines the _destination_path.
        /// </summary>
        public static string _destination_path = @"C:\Users\Mark Fuller\Desktop\Senior\DM\traffic\resources\RawData\testout.xls";

        /// <summary>
        /// The Main.
        /// </summary>
        /// <param name="args">The args<see cref="string[]"/>.</param>
        public static void Main(string[] args)
        {

            // get list of files
            var years = Directory.GetDirectories(_resource_dir);
            List<Task> tasks = new List<Task>();

            foreach (var year in years)
            {
                var destination_dir = _resource_dir + Path.DirectorySeparatorChar + "parsed_" + Path.GetFileName(year);
                Directory.CreateDirectory(destination_dir);

                var files = Directory.GetFiles(year);

                foreach (var file in files)
                {

                    var destination_filename = destination_dir + Path.DirectorySeparatorChar + Path.GetFileNameWithoutExtension(file);

                    Console.WriteLine("Started:\t" + file);

                    Task raw = Task.Run(() => ExtractSheet(file, destination_filename + "_raw", "RawData"));
                    Task proc = Task.Run(() => ExtractSheet(file, destination_filename + "_proc", "ProcData"));

                    tasks.Add(raw);
                    tasks.Add(proc);
                }
            }

            foreach (Task task in tasks)
            {
                task.Wait();
            }

            Console.Read();
        }

        /// <summary>
        /// The ExtractSheet.
        /// </summary>
        /// <param name="file">The file<see cref="string"/>.</param>
        /// <param name="destination">The destination<see cref="string"/>.</param>
        /// <param name="sheet">The sheet<see cref="string"/>.</param>
        public static void ExtractSheet(string file, string destination, string sheet)
        {
            WorkBook workbook = WorkBook.Load(file);

            WorkBook new_wb = WorkBook.Create();

            var ws = workbook.GetWorkSheet(sheet);

            try
            {
                ws.CopyTo(new_wb, "data");
            }catch(ArgumentException ae)
            {
                Console.Error.WriteLine("FAILED:\t" + destination);

                return;
            }

            new_wb.SaveAs(destination + ".xls");
            new_wb.Close();

            workbook.Close();

            Console.WriteLine("Finished:\t" + destination);
        }
    }
}
