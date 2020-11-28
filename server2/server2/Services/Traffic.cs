using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using server2.Models;

namespace server2.Services
{
    public class Traffic
    {
        private static TrafficModel[] _TrafficData;

        public Traffic()
        {
            if(_TrafficData == null)
            {
                setData();
            }
        }

        public TrafficModel[] getTrafficData()
        {
            return _TrafficData;
        }

        private static void setData(){
            Console.WriteLine("reading csv");
            string filePath = @".\Resources\combined_csv.csv";
            StreamReader sr = new StreamReader(filePath);
            var lines = new List<string[]>();
            int Row = 0;
            while (!sr.EndOfStream)
            {
                string[] Line = sr.ReadLine().Split(',');
                lines.Add(Line);
                Row++;
            }

            var data = lines.ToArray();



            _TrafficData = TrafficModel.TrafficModelParser(data);
            Console.WriteLine("csv loaded");
        }
    }
}
