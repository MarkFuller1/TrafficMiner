using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Excel = Microsoft.Office.Interop.Excel;       //microsoft Excel 16 object in dependencies-> COM tab

namespace TrafficDataPrep
{
    /// <summary>
    /// Defines the <see cref="ReadFromFile" />.
    /// </summary>
    internal class SplitFiles
    {
        /// <summary>
        /// Defines the _resource_path.
        /// </summary>
        internal static string _resource_path = @"C:\Users\Mark Fuller\Desktop\Senior\DM\traffic\resources\";

        /// <summary>
        /// The Main.
        /// </summary>
        internal static void Main()
        {
            XLSMReader.ReadXLSM();
        }

        /// <summary>
        /// The Split.
        /// </summary>
        /// <param name="args">The args<see cref="string[]"/>.</param>
        internal static void Split(string[] args)
        {
            Console.WriteLine(_resource_path);

            if (isFile(_resource_path))
            {
                parseFile(_resource_path, 100000);
            }
            else
            {
                // Get list of files in source dir
                var files = Directory.GetFiles(_resource_path);

                List<Task> tasks = new List<Task>();


                foreach (string file in files)
                {
                    // Wait on a single task with no timeout specified.
                    Task taskA = Task.Run(() => parseFile(file, 100000));

                    tasks.Add(taskA);
                }

                foreach (Task task in tasks)
                {
                    task.Wait();
                }
            }
            Console.ReadLine();
        }

        /// <summary>
        /// The breakDownFile.
        /// </summary>
        /// <param name="resource_path">The resource_path<see cref="string"/>.</param>
        private static void breakDownFile(string resource_path)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// The ReadFile.
        /// </summary>
        /// <param name="filepath">The filepath<see cref="string"/>.</param>
        /// <returns>The <see cref="string[]"/>.</returns>
        internal static Dictionary<string, ArrayList> ReadFile(string filepath)
        {
            DateTime minDate = DateTime.MaxValue;
            DateTime maxDate = DateTime.MinValue;

            Dictionary<string, ArrayList> days = new Dictionary<string, ArrayList>();

            System.IO.StreamReader reader = new System.IO.StreamReader(filepath);

            string line;
            int counter = 0;
            while ((line = reader.ReadLine()) != null)
            {
                var fields = line.Split(",");
                //2019/08/13 00:55:06.934, ZoneStatistics, 1955786687, 02 Adv, 1, 0, 15,
                var date = DateTime.ParseExact(fields[0], "yyyy/MM/dd HH:mm:ss.fff", new System.Globalization.CultureInfo("en-US"));
                if (days.ContainsKey(date.Month + " " + date.Year))
                {
                    var previous = days[date.Month + " " + date.Year];
                    previous.Add(line);
                }
                else
                {
                    var list = new ArrayList();
                    list.Add(line);
                    days.Add(date.Month + " " + date.Year, list);
                }
                minDate = (date < minDate) ? date : minDate;
                maxDate = (date > maxDate) ? date : maxDate;

                counter++;
            }

            reader.Close();
            Console.WriteLine("First Day:" + minDate.ToString("yyyy / MM / dd HH: mm:ss.fff", new System.Globalization.CultureInfo("en-US")));
            Console.WriteLine("Last Day:" + maxDate.ToString("yyyy / MM / dd HH: mm:ss.fff", new System.Globalization.CultureInfo("en-US")));

            return days;
        }

        /// <summary>
        /// The operateOnFile.
        /// </summary>
        /// <param name="file">The file<see cref="string"/>.</param>
        /// <returns>The <see cref="Task"/>.</returns>
        private static async Task operateOnFile(string file)
        {
            await Task.Run(() =>
            {
                parseFile(file, 100000);
            });
        }

        /// <summary>
        /// The parseFile.
        /// </summary>
        /// <param name="file">The file<see cref="string"/>.</param>
        /// <param name="fileSize">The fileSize<see cref="int"/>.</param>
        private static void parseFile(string file, int fileSize)
        {
            Console.WriteLine("Reading: " + file);
            // Read the file and split it up by month
            var monthData = ReadFile(file);

            // write each entry of the map into its own file. 
            foreach (KeyValuePair<string, ArrayList> entry in monthData)
            {
                var left = entry.Value.Count;
                int i = 0;
                while (left > 0)
                {
                    // create a dir in the original location, name it the same as the original file, name the file the month day
                    var dataFilename = new DirectoryInfo(_resource_path).CreateSubdirectory(Path.GetFileNameWithoutExtension(file)).FullName + Path.DirectorySeparatorChar + entry.Key + "_" + i + ".csv";

                    Console.WriteLine(dataFilename);

                    // delete the file before writing to it
                    if (File.Exists(dataFilename)) { File.Delete(dataFilename); }

                    var length = fileSize;
                    // write the array to the file. 
                    length = Math.Min(fileSize, left);

                    var shortList = entry.Value.GetRange(i * fileSize, length);
                    File.WriteAllLines(dataFilename, shortList.Cast<string>().ToArray());

                    left = left - length;
                    i++;
                }
            }
        }

        /// <summary>
        /// The splitFile.
        /// </summary>
        /// <param name="file">The file<see cref="string"/>.</param>
        /// <param name="fileSize">The fileSize<see cref="int"/>.</param>
        private static void splitFile(string file, int fileSize)
        {
            Console.WriteLine("Reading: " + file);
            // Read the file and split it up by month
            var monthData = ReadFile(file);

            // write each entry of the map into its own file. 
            foreach (KeyValuePair<string, ArrayList> entry in monthData)
            {
                var left = entry.Value.Count;
                int i = 0;
                while (left > 0)
                {
                    // create a dir in the original location, name it the same as the original file, name the file the month day
                    var dataFilename = Path.ChangeExtension(file, "") + "_" + i + ".csv";

                    Console.WriteLine(dataFilename);

                    // delete the file before writing to it
                    if (File.Exists(dataFilename)) { File.Delete(dataFilename); }

                    var length = fileSize;
                    // write the array to the file. 
                    length = Math.Min(fileSize, left);

                    var shortList = entry.Value.GetRange(i * fileSize, length);
                    File.WriteAllLines(dataFilename, shortList.Cast<string>().ToArray());

                    left = left - length;
                    i++;
                }
            }
        }

        /// <summary>
        /// The isFile.
        /// </summary>
        /// <param name="path">The path<see cref="string"/>.</param>
        /// <returns>The <see cref="bool"/>.</returns>
        internal static bool isFile(string path)
        {
            // get the file attributes for file or directory
            FileAttributes attr = File.GetAttributes(@path);

            if (attr.HasFlag(FileAttributes.Directory))
                return false;
            else
                return true;
        }
    }

    /// <summary>
    /// Defines the <see cref="XLSMReader" />.
    /// </summary>
    internal class XLSMReader
    {
        /// <summary>
        /// Defines the _resource_path.
        /// </summary>
        public static string _resource_path = @"C:\Users\Mark Fuller\Desktop\Senior\DM\traffic\resources\RawData\2019\8_0.xlsm";

        /// <summary>
        /// The ReadXLSM.
        /// </summary>
        public static void ReadXLSM()
        {
            //Create COM Objects. Create a COM object for everything that is referenced
            Excel.Application xlApp = new Excel.Application();
            Excel.Workbook xlWorkbook = xlApp.Workbooks.Open(_resource_path);
            Excel._Worksheet xlWorksheet = (Excel._Worksheet)xlWorkbook.Sheets[1];
            Excel.Range xlRange = xlWorksheet.UsedRange;

            int rowCount = xlRange.Rows.Count;
            int colCount = xlRange.Columns.Count;

            //iterate over the rows and columns and print to the console as it appears in the file
            //excel is not zero based!!
            for (int i = 1; i <= rowCount; i++)
            {
                for (int j = 1; j <= colCount; j++)
                {
                    //new line
                    if (j == 1)
                        Console.Write("\r\n");

                    //write the value to the console
                    if (xlRange.Cells[i, j] != null && xlRange.Cells[i, j] != null)
                        Console.Write(xlRange.Cells[i, j].ToString() + "\t");
                }
            }

            //cleanup
            GC.Collect();
            GC.WaitForPendingFinalizers();

            //rule of thumb for releasing com objects:
            //  never use two dots, all COM objects must be referenced and released individually
            //  ex: [somthing].[something].[something] is bad

            //release com objects to fully kill excel process from running in the background
            Marshal.ReleaseComObject(xlRange);
            Marshal.ReleaseComObject(xlWorksheet);

            //close and release
            xlWorkbook.Close();
            Marshal.ReleaseComObject(xlWorkbook);

            //quit and release
            xlApp.Quit();
            Marshal.ReleaseComObject(xlApp);
        }
    }
}
