namespace TrafficDataPrep
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Threading.Tasks;
    using System.Threading;

    /// <summary>
    /// Defines the <see cref="ReadFromFile" />.
    /// </summary>
    internal class ReadFromFile
    {
        /// <summary>
        /// Defines the _resource_path.
        /// </summary>
        // internal static string _resource_path = @"C:\Users\Mark Fuller\Desktop\Senior\DM\traffic\resources";
        internal static string _resource_path;
        /// <summary>
        /// The Main.
        /// </summary>
        internal static void Main(string [] args)
        {
            if (args.Length != 1){
                Console.Error.WriteLine("Give me a path to data");
            }

            _resource_path = args[0];
            Console.WriteLine(_resource_path);

            // Get list of files in source dir
            var files = Directory.GetFiles(_resource_path);

            List<Task> tasks = new List<Task>();


            foreach (string file in files)
            {
                // Wait on a single task with no timeout specified.
                Task taskA = Task.Run( () => parseFile(file));

                tasks.Add(taskA);
            }

            foreach(Task task in tasks){
                task.Wait();
            }
        }

        /// <summary>
        /// The ReadFile.
        /// </summary>
        /// <param name="filepath">The filepath<see cref="string"/>.</param>
        /// <returns>The <see cref="string[]"/>.</returns>
        internal static Dictionary<long, ArrayList> ReadFile(string filepath)
        {
            DateTime minDate = DateTime.MaxValue;
            DateTime maxDate = DateTime.MinValue;

            Dictionary<long, ArrayList> days = new Dictionary<long, ArrayList>();

            System.IO.StreamReader reader = new System.IO.StreamReader(filepath);

            string line;
            int counter = 0;
            while ((line = reader.ReadLine()) != null)
            {
                var fields = line.Split(",");
                //2019/08/13 00:55:06.934, ZoneStatistics, 1955786687, 02 Adv, 1, 0, 15,
                var date = DateTime.ParseExact(fields[0], "yyyy/MM/dd HH:mm:ss.fff", new System.Globalization.CultureInfo("en-US"));
                if (days.ContainsKey(date.Month))
                {
                    var previous = days[date.Month];
                    previous.Add(line);
                }
                else
                {
                    var list = new ArrayList();
                    list.Add(line);
                    days.Add(date.Month, list);
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

        private static async Task operateOnFile(string file){
            await Task.Run ( () => {
                parseFile(file);
            });
        }

        private static void parseFile(string file){
                Console.WriteLine("Reading: " + file);
                // Read the file and split it up by month
                var monthData = ReadFile(file);

                // write each entry of the map into its own file. 
                foreach (KeyValuePair<long, ArrayList> entry in monthData)
                {
                    // create a dir in the original location, name it the same as the original file, name the file the month day
                    var dataFilename = new DirectoryInfo(_resource_path).CreateSubdirectory(Path.GetFileNameWithoutExtension(file)).FullName + Path.DirectorySeparatorChar + entry.Key + ".csv";
                    Console.WriteLine(dataFilename);

                    // delete the file before writing to it
                    if (File.Exists(dataFilename)) { File.Delete(dataFilename); }

                    // write the array to the file. 
                    File.WriteAllLines(dataFilename, entry.Value.Cast<string>().ToArray());
                }
        }
    }
}
